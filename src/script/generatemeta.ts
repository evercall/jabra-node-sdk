// This script will generate an api-meta.json file with a complete list of API calls with parameters etc from the exported classes 
// visible from the index.ts file
// 
// The script uses the (unstable) "typescript compiler api" documented at "https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API"
// The script is an extended version of the "Using the Type Checker" example from the above link with many additions. The compiler API is 
// not extremely well documented so the following links may be useful to understand it "https://github.com/runem/ts-simple-type",
// "https://stackoverflow.com/questions/47215069/how-to-use-typescript-compiler-api-to-get-normal-function-info-eg-returntype-p",
// "https://stackoverflow.com/questions/34697131/typescript-reflection-required-parameters-default-values",
// "https://ts-ast-viewer.com/"

import * as ts from "typescript";
import * as fs from "fs";
import * as path from 'path';
import { SymbolEntry, ClassEntry, PropertyEntry, MethodEntry, ParameterEntry } from '../main/meta';

const srcRootIndexFile = path.normalize(path.join(__dirname, "../", "../", "src/", "main/", "index.ts"));
const dstFile = path.normalize(path.join(__dirname, "../", "main/", "../", "../", "dist/", "api-meta.json"));

/** Generate documentation for all classes in a set of .ts files */
function generateDocumentation(
  fileNames: string[],
  options: ts.CompilerOptions
): void {
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();

  let output: ClassEntry[] = [];

  // Visit every visible sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile && sourceFile.fileName.endsWith("app.ts") || sourceFile.fileName.endsWith("device.ts")) {
      ts.forEachChild(sourceFile, visit);
    }
  }

  // print out the doc
  const outputFolder = path.dirname(dstFile);
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: false });
  }
  fs.writeFileSync(dstFile, JSON.stringify(output, undefined, 4));

  console.log("Successfully generated " + dstFile + " with API meta-information for " + output.length + " classes.");

  // That it - we are done.
  return;

  /** visit nodes finding classes, methods/constructors, properties */
  function visit(node: ts.Node) {
    if (ts.isClassDeclaration(node) && node.name) {
      // Only consider exported public nodes
      if (isNodeExported(node) && isNodePublic(node)) {
        // This is a top level class, get its symbol
        let symbol = checker.getSymbolAtLocation(node.name);
        if (symbol) {
          output.push(serializeClass(node, symbol));
        }

        ts.forEachChild(node, visit);
      }
    } else if (ts.isModuleDeclaration(node)) {
      ts.forEachChild(node, visit);
    } else if (ts.isPropertyDeclaration(node)) {
      let symbol = checker.getSymbolAtLocation(node.name);
      let curClass = output[output.length - 1];

      if (curClass && isNodePublic(node) && symbol && !symbol.getName().startsWith("_")) { // Todo: Also filter internals/privates.
        curClass.properties.push(serializeProperty(node, symbol!));      
      }
    } /* else if (ts.isConstructorDeclaration(node)) {
      let symbol = checker.getSymbolAtLocation(node.parent!.name!);
      let curClass = output[output.length - 1];
      if (curClass && isNodePublic(node) && symbol && !symbol.getName().startsWith("_")) { // Todo: Also filter internals/privates.
        curClass.constructors.push(serializeSignature(node, symbol!));
      }     
    } */ else if (ts.isMethodDeclaration(node)) {
      let symbol = checker.getSymbolAtLocation(node.name);

      let curClass = output[output.length - 1];
      if (curClass && isNodePublic(node) && symbol && !symbol.getName().startsWith("_")) { // Todo: Also filter internals/privates.
        let result = serializeSignature(node, symbol!);
        let existingMethodOverloadIndex = curClass.methods.findIndex(e => e.name === symbol!.getName());
        // If the signature already exist it's an overload, and we will only use the last one which 
        // should be the impl. Otherwise just add it.
        if (existingMethodOverloadIndex>=0) {
          curClass.methods[existingMethodOverloadIndex]=result;
        } else {
          curClass.methods.push(result);
        } 
      }   
    }
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(node: ts.Node, symbol: ts.Symbol): SymbolEntry {
    const type = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
    return {
      name: symbol.getName(),
      documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim(),
      tsType: getTsType(type),
      jsType: getJsType(type),
    };
  }

  function serializeProperty(node: ts.PropertyDeclaration, symbol: ts.Symbol): PropertyEntry {
    let details = serializeSymbol(node, symbol);
    let isReadonly = isNodeReadonly(node);
    return { ...details, readonly: isReadonly};
  }

   /** Serialize a class symbol information */
  function serializeClass(node: ts.Node, symbol: ts.Symbol) {    
    let details: ClassEntry = { 
      comment: "This file provides metadata about this API for reflective lookup usage. It is autogenerated by the 'generatemeta.ts' script. DO NOT CHANGE BY HAND - RE-GENERATE AS NEEDED.",
      ...serializeSymbol(node, symbol), 
      tsType: 'class', // override strange reflected type for classes.
      // constructors: [], 
      methods: [], 
      properties: []
    };

    return details;
  }

  /** Serialize a signature (call or construct) */
  function serializeSignature(node: ts.MethodDeclaration | ts.ConstructorDeclaration, symbol: ts.Symbol) : MethodEntry {
    const signature = checker.getSignatureFromDeclaration(node);
    const returnType = signature!.getReturnType();

    return {
      name: symbol.getName(),
      parameters: node.parameters.map(p => {
        let optional = checker.isOptionalParameter(p);
        let nodesymbol = checker.getSymbolAtLocation(p.name);
        let result: ParameterEntry = { ...serializeSymbol(node, nodesymbol!), optional: optional };
        return result;
      }),
      tsType: getTsType(returnType),
      jsType: getJsType(returnType),
      documentation: ts.displayPartsToString(signature!.getDocumentationComment(checker)).trim()
    };
  }

  function getTsType(type: ts.Type) {
    let result = checker.typeToString(type);
    // Strange, sometimes result is quoted - fix that.
    if(result[0] == "\"" && result[result.length - 1] == "\""){
      result = result.substr(1, result.length -2);
    }
    return result;
  }

  function getJsType(type: ts.Type): string {
    if (isFunction(type)) {
      return "function";
    } if (isArray(type)) {
      return "array";
    } else if (isStringType(type)) {
      return "string";
    } else if (isNumberType(type)) {
      return "number";
    } else if (isBooleanType(type)) {
      return "boolean"
    } else if (isPromiseType(type)) {
      return "Promise"
    } else if (isDateType(type)) {
      return "Date"
    } else if (isObjectType(type)) {
      return "object"
    } else if (isVoidType(type)) {
      return "void"
    } else if (isUnionType(type)) {
       let jsTypes = type.types.map(t => getJsType(t));
       let uniqueJsTypes = Array.from(new Set(jsTypes).values());
       return uniqueJsTypes.join(" | ");
    } else if (isIntersectionType(type)) {
      let jsTypes = type.types.map(t => getJsType(t));
      let uniqueJsTypes = Array.from(new Set(jsTypes).values());
      return uniqueJsTypes.join(" & ");
    } else {
      // let flags = type.getFlags().toString();
      return "unknown";
    }
  } 
  
  function isUnionType(type: ts.Type) : type is ts.UnionType {
    return (type.flags & (ts.TypeFlags.Union)) != 0;
  }

  function isIntersectionType(type: ts.Type) : type is ts.IntersectionType {
    return (type.flags & (ts.TypeFlags.Intersection)) != 0;
  }

  function isVoidType(type: ts.Type) {
    return (type.flags & ts.TypeFlags.Void) != 0;
  }

  function isObjectType(type: ts.Type) : type is ts.ObjectType {
    return (type.flags & ts.TypeFlags.Object || checker.typeToString(type) == "this") != 0;
  }

  function isStringType(type: ts.Type) {
    return ((type.flags & (ts.TypeFlags.String | ts.TypeFlags.StringLike | ts.TypeFlags.StringLiteral)) != 0);
  }

  function isNumberType(type: ts.Type) {
    return (type.flags & (ts.TypeFlags.Number | ts.TypeFlags.NumberLike | ts.TypeFlags.NumberLiteral)) != 0;
  }

  function isBooleanType(type: ts.Type) {
    return (type.flags & (ts.TypeFlags.Boolean | ts.TypeFlags.BooleanLike | ts.TypeFlags.BooleanLiteral)) != 0;
  }

  function isArray(type: ts.Type): type is ts.TypeReference {
    if (isObjectType(type)) {
      const symbol = type.getSymbol();
      if (symbol == null) { return false; }
      return getTypeArguments(type).length === 1 && ["ArrayLike", "ReadonlyArray", "Array"].includes(symbol.getName());
    } else return false;
  }

  function isFunction(type: ts.Type): type is ts.ObjectType {
    if (isObjectType(type)) {
      const symbol = type.getSymbol();
      if (symbol == null) { return false; }
      return (symbol.flags & ts.SymbolFlags.Function) !== 0 || symbol.escapedName === "Function" || (symbol.members != null && symbol.members.has("__call" as any));
    } else return false;
  }

  function isDateType(type: ts.Type): type is ts.ObjectType {
    if (isObjectType(type)) {
      const symbol = type.getSymbol();
      if (symbol == null) { return false; }
      return symbol.getName() === "Date";
    } else return false;
  }

  function isPromiseType(type: ts.Type): type is ts.ObjectType {
    if (isObjectType(type)) {
      const symbol = type.getSymbol();
      if (symbol == null) { return false; }
      return symbol.getName() === "Promise";
    } else return false;
  }

  function getTypeArguments(type: ts.ObjectType): ts.Type[] {
    if (isObjectType(type) && isObjectTypeReference(type)) {
      return Array.from(type.typeArguments || []);
    }
  
    return [];
  }

  function isObjectTypeReference(type: ts.ObjectType): type is ts.TypeReference {
    return (type.objectFlags & ts.ObjectFlags.Reference) !== 0;
  }

  function isNodeExported(node: ts.Declaration): boolean {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0;
  }

  function isNodePublic(node: ts.Declaration): boolean {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Private) == 0
    && (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Protected) == 0
  }

  function isNodeReadonly(node: ts.Declaration): boolean {
    return ((ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Readonly) !== 0);
  }
}

generateDocumentation([srcRootIndexFile], {
  target: ts.ScriptTarget.ES2016,
  module: ts.ModuleKind.CommonJS
});

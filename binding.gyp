{
  "variables": {
    "conditions": [
      ["OS=='win' and target_arch=='ia32'", {
        "jabralibfolder": "libjabra/windows/x86/libjabra.lib",
        "jabralibfile": "libjabra.dll"
      }],
      ["OS=='win' and target_arch=='x64'", {
        "jabralibfolder": "libjabra/windows/x64/libjabra.lib",
        "jabralibfile": "libjabra.dll"
      }],
      ["OS=='mac'", {
        "jabralibfolder": "../libjabra/mac/libjabra.dylib",
        "jabralibfile": "libjabra.dylib"
      }],
      ["OS=='linux' and target_arch=='ia32'", {
        "jabralibfolder": "libjabra/ubuntu/x32",
        "jabralibfile": "libjabra.so.1.8.7.12"
      }],
      ["OS=='linux' and target_arch=='x64'", {
        "jabralibfolder": "libjabra/ubuntu/x64",
        "jabralibfile": "libjabra.so.1.8.7.12"
      }],
      ["OS=='linux' and target_arch=='arm'", {
        "jabralibfolder": "TODO",
        "jabralibfile": "TODO"
      }],
      ["OS=='linux' and target_arch=='arm64'", {
        "jabralibfolder": "TODO",
        "jabralibfile": "TODO"
      }],
    ],
  },
  "targets": [
    {
      "target_name": "sdkintegration",
      "cflags_cc": [
        "-std=c++14"
      ],
      "sources": [ "<!@(node -p \"require('fs').readdirSync('./src/main').filter(f => /\.cc$/.test(f)).map(f=>'src/main/'+f).join(' ')\")" ],
      "include_dirs": [
        "libjabra/headers",
        "includes",
        "<!@(node -p \"require('node-addon-api').include\")",
      ],
      'defines': [ 'NAPI_CPP_EXCEPTIONS' ],
      'link_settings': {
         'library_dirs': [
            '.',
          ],
      },
      'conditions': [
        ['OS=="win"', {
          'conditions': [
            ['target_arch=="ia32"', {
              'libraries': [ 'libjabra/windows/x86/libjabra.lib' ],
              "copies":
              [
                  {
                    'destination': '<(PRODUCT_DIR)',
                    'files': ['<(module_root_dir)/libjabra/windows/x86/libjabra.dll']
                  }
              ]
            }],
            ['target_arch=="x64"', {
              'libraries': [ 'libjabra/windows/x64/libjabra.lib' ],
              "copies":
              [
                  {
                    'destination': '<(PRODUCT_DIR)',
                    'files': ['<(module_root_dir)/libjabra/windows/x64/libjabra.dll']
                  }
              ]
            }]
          ],
          'defines': [ '_HAS_EXCEPTIONS=1' ],
          'msvs_settings': {
            'VCCLCompilerTool': { 'ExceptionHandling': 1 },
          },
        }],
        ['OS=="linux"', {
          'libraries': [ "../<(jabralibfolder)/<(jabralibfile)" ],
          'ldflags': [
            "-Wl,-rpath,'$$ORIGIN'"
          ],
          'cflags_cc': [
            '-fexceptions',
            '-Wno-unused-variable'
          ],
          "copies":
          [
            {
              'destination': '<(PRODUCT_DIR)',
              'files': ['<(module_root_dir)/<(jabralibfolder)/<(jabralibfile)']
            }
          ],
        }],
        ['OS=="mac"', {
         'libraries': [ '../libjabra/mac/libjabra.dylib' ],
         'xcode_settings': {
           'ld_version_details': 'true',
           'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
           'CLANG_CXX_LIBRARY': 'libc++',
           'MACOSX_DEPLOYMENT_TARGET': '10.7',
           'WARNING_CFLAGS': [
                          '-Wall',
                          '-Wendif-labels',
                          '-W',
                          '-Wno-unused-variable',
                          '-Wno-unused-lambda-capture',
                          '-Wno-unused-parameter',
                          '-Wno-dangling-else'
            ],
         },
         "copies":
         [
            {
              'destination': '<(PRODUCT_DIR)',
              'files': ['<(module_root_dir)/libjabra/mac/libjabra.dylib']
            }
         ],
         'postbuilds': [
          {
            'postbuild_name': 'fix relative dylib lookup',
            'action': [
              'install_name_tool',
              '-change',
              '@rpath/libjabra.dylib',
              '@loader_path/libjabra.dylib',
              '${BUILT_PRODUCTS_DIR}/sdkintegration.node',
            ],
          },
         ]
        }],
      ]
    }
  ]
}

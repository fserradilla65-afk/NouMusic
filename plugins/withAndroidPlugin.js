const { withAndroidManifest, withAppBuildGradle } = require('@expo/config-plugins/build/plugins/android-plugins.js')

const withAndroidSigningConfig = (config) => {
  config = withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application?.[0]
    if (app && app.$['android:extractNativeLibs'] !== 'true') {
      app.$['android:extractNativeLibs'] = 'true'
    }
    return config
  })

  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents

    // Add abiCodes if not present
    if (!contents.includes('ext.abiCodes')) {
      contents = contents.replace(
        'android {',
        `ext.abiCodes = [x86:1, x86_64:2, 'armeabi-v7a':3, 'arm64-v8a': 4]

android {`,
      )
    }

    contents = contents.replace(/"zh-Hans"/g, '"b+zh+Hans"')
    contents = contents.replace(/"pt-BR"/g, '"b+pt+BR"')

    // FUERZO LA FIRMA DE DEBUG PARA LA VERSIÓN RELEASE
    // Esto hace que la APK de producción sea instalable sin crear llaves privadas
    if (contents.includes('release {')) {
      contents = contents.replace(
        /release \{/,
        'release {\n            signingConfig signingConfigs.debug'
      )
    }

    if (!contents.includes('dependenciesInfo {')) {
      contents = contents.replace(
        /androidResources \{([\s\S]*?)}/,
        `androidResources {$1}
    dependenciesInfo {
        includeInApk = false
        includeInBundle = false
    }
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include project.ext.abiCodes.keySet() as String[]
        }
    }
    android.applicationVariants.configureEach { variant ->
        variant.outputs.each { output ->
            def baseAbiVersionCode = project.ext.abiCodes.get(output.getFilter(com.android.build.OutputFile.ABI))
            if (baseAbiVersionCode != null) {
                output.versionCodeOverride = (100 * project.android.defaultConfig.versionCode) + baseAbiVersionCode
            }
        }
    }`,
      )
    }

    config.modResults.contents = contents
    return config
  })
}

module.exports = withAndroidSigningConfig

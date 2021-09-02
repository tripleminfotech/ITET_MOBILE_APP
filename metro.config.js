// /**
//  * Metro configuration for React Native
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// // module.exports = {
// //   transformer: {
// //     getTransformOptions: async () => ({
// //       transform: {
// //         experimentalImportSupport: false,
// //         inlineRequires: false,
// //       },
// //     }),
// //   },
// // };

// const { getDefaultConfig } = require("metro-config");

// module.exports = (async () => { 
// 	const {  
// 		resolver: { 
// 			sourceExts, 
// 			assetExts 
// 		}  
// 	} = await getDefaultConfig(); 

// 	return {
// 		transformer: {      
// 			babelTransformerPath: require.resolve("react-native-svg-transformer")    
// 		},    
// 		resolver: {
// 			assetExts: assetExts.filter(ext => ext !== "svg"),
// 			sourceExts: [...sourceExts, "svg"]    
// 		}};
// })();

// const blacklist = require('metro-config/src/defaults/blacklist');

// module.exports = {
//   resolver: {
//     blacklistRE: blacklist([
//       /ios\/Pods\/JitsiMeetSDK\/Frameworks\/JitsiMeet.framework\/assets\/node_modules\/react-native\/.*/,
//     ]),
//   },
// };

const { getDefaultConfig } = require("metro-config");

module.exports = (async() => {
    const {
        resolver: { sourceExts, assetExts }
    } = await getDefaultConfig();
    return {
        transformer: {
            getTransformOptions: async() => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: false
                }
            }),
            babelTransformerPath: require.resolve("react-native-svg-transformer")
        },
        resolver: {
            assetExts: assetExts.filter(ext => ext !== "svg"),
            sourceExts: [...sourceExts, "svg"]
        }
    };
})();
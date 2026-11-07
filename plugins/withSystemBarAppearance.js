const {withAndroidStyles,AndroidConfig}=require('@expo/config-plugins');

// Android's three-button contrast scrim would darken the shared petrol frame.
// This is applied to the APK theme; OTA updates cannot change Android themes.
module.exports=function withSystemBarAppearance(config){
 return withAndroidStyles(config,config=>{
  const theme=AndroidConfig.Styles.getAppThemeGroup(config.modResults);
  for(const [name,value] of Object.entries({
   'android:enforceNavigationBarContrast':'false',
   'android:windowLightNavigationBar':'false',
   'android:windowLightStatusBar':'false'
  })){
   AndroidConfig.Styles.assignStylesValue(config.modResults,{add:true,parent:theme,name,value});
  }
  return config;
 });
};

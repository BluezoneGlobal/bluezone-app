<h1 align="center">
  <img src="logo.png"/><br/>
  Bluezone
</h1>

<h3 align="center">
Protect yourself, protect the community
</h3>
<p align="center" >Bluezone is an open source software for contact tracing in COVID-19 pandemic<p>

# Installation

Step 1. Clone the bluezone repository from github:

<p> Bluezone: </p>

```
git clone https://github.com/BluezoneGlobal/bluezone-app.git --recursive
```

Step 2. install package.
```
npm install
```

Step 3. Start project with 2 command

```
npx react-native start
```

Android:
```
npx react-native run-android
```

Ios: Before run IOS app make sure you have install Cocoapods dependencies. To install cocoapods run this command
in `ios` directory

```
pod install
```

```
npx react-native run-ios
```

## Native debugging

1. Install LLDB from SDK Tools in Android-studio.

2. In Android-studio go to Run->Edit Configurations->Debugger.

3. Select 'Dual' or 'Native' and add the path to linphone-sdk debug libraries (build/libs-debug/ for example).

4. Open native file and put your breakpoint on it.

5. Make sure you are using the debug AAR in the app/build.gradle script and not the release one (to have faster builds by default the release AAR is used even for debug APK flavor).

6. Debug app.

# Building the app

If you have Android Studio, simply open the project, wait for the gradle synchronization and then build/install the app.
It will download the bluezone library from our Maven repository as an AAR file so you don't have to build anything yourself.

If you don't have Android Studio, you can build and install the app using gradle:
```
./gradlew assembleDebug
```
will compile the APK file (assembleRelease to instead if you want to build a release package), and then
```
./gradlew installDebug
```
to install the generated APK in the previous step (use installRelease instead if you built a release package).

APK files are stored within ```./app/build/outputs/apk/debug/``` and ```./app/build/outputs/apk/release/``` directories.

### License

Copyright © 2020 - Bluezone Global.

 - under a [GNU/GPLv3 license](https://www.gnu.org/licenses/gpl-3.0.en.html), for free (open source). Please make sure that you understand and agree with the terms of this license before using it (see LICENSE file for details).

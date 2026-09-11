# Mobile Application Security Workshop 

# Prerequisites

 This workshop has been tested in these platforms:

*  x86\_64 Linux          
* Apple Silicon Mac

Requirements:

* At least **8GB** of **RAM**.  
* **32 GB** of free **disk** space.  
* On Linux, **Intel VT-x** or **AMD-V** virtualization enabled and access to KVM.

# 

# Setup

**Note**: These steps have been documented and reproduced in September 2026\.   
Steps may vary depending on time passed.

1. Open the [official Android Studio](https://developer.android.com/studio) download page.   
2. Download the installer for your computer.

### MacOS

1.  Select the Mac **with Apple chip** download**.**  
2.  Open the .dmg file.  
3.  Drag Android Studio into Applications.  
4.  Open Android Studio from Applications.  
5.  Confirm that you want to open it if macOS displays a warning.

###  Linux x86\_64

1. Download the Linux .tar.gz file.  
2. Open Downloads in your file manager.  
3. Extract the archive into a directory where you have write permission.  
4. Open a terminal in android-studio/bin.  
5. Run the included launcher: ./studio or ./studio.sh, depending on the downloaded version.

##  Initial setup wizard

1. Select “Do not import settings” if this is a new installation.  
2. Continue to Install Type.  
3. Select Standard.  
4. Accept the licenses.  
5. Click Finish.  
6. Wait for the downloads to complete.  
7. Do not create an Android project.

## TBD

VIA DE CREACION MANUAL DEL DISPOSITIVO \+ ROOT  
O   
VIA INSTALANDO EL DISPOSITIVO CON ROOT YA

## Virtual device creation

1. Return to the welcome screen.  
2. Click “More Actions → Virtual Device Manager”.  
3. Click “Create Device”  
4. Select Phone.  
5. Select Pixel 8\.  
6. Click Next.  
7. Find **Android 16.0, API 36\.**  
8.  Select a **Google Play system image** with the correct architecture:  
   1. Linux x86\_64 \- **x86\_64**  
   2. macOS with Apple Silicon \- **arm64-v8a**

9\. Download the image and accept its license.  
10\. Click Next.  
11\. Name the device.  
12\. In the advanced settings, select **Cold boot** if the boot option is available.  
13\. Click Finish.

## Preparing Android SDK Paths

 Run only the commands for your platform.

 **macOS:**  
 	`export ANDROID_HOME="$HOME/Library/Android/sdk"`  
 	`export PATH="$ANDROID_HOME/platform-tools:$PATH"`  
  **Linux:**  
   `export ANDROID_HOME="$HOME/Android/Sdk"`  
 `export PATH="$ANDROID_HOME/platform-tools:$PATH"`

 Run the following command to verify that ADB detects the device:  
   	`adb devices`  
 Run the following command to verify the Android version of the device:  
`adb shell getprop ro.build.version.release`

## Root the device using Magisk via rootAVD

### Download rootAVD

1. Navigate to the [GitLab rootAVD repository.](https://gitlab.com/newbit/rootAVD)  Do not use the old GitHub repository as the source for the current version.  
2. Download the ZIP archive for the revision specified by the organizers TBD version.  
3. Extract the archive.  
4. Locate the directory containing rootAVD.sh.

###  Select the image to modify

1. Keep the emulator running and unlocked.  
2. In the terminal window, navigate to the rootAVD directory.  
3. Execute the following command:

`bash ./rootAVD.sh ListAllAVDs`

4. Find the entry matching Android 36, Google Play, and your architecture.

###  Start the installation

 Run only the command for your platform.

*  Linux x86\_64:

`bash ./rootAVD.sh system-images/android-36/google_apis_playstore/x86_64/ramdisk.img FAKEBOOTIMG`

*  macOS:

`bash ./rootAVD.sh system-images/android-36/google_apis_playstore/arm64-v8a/ramdisk.img FAKEBOOTIMG`

1. When the version menu appears, select the TBD Magisk version.  
2.  Wait for rootAVD to open Magisk inside the emulator.

###  Patch the image in Magisk

 1\. In the Magisk section, tap Install.  
 2\. Select Select and Patch a File.  
 3\. Open Downloads.  
 4\. Select fakeboot.img.  
 5\. Tap Let’s Go.  
 6\. Wait for patching to finish.  
 7\. Return to the terminal.  
 8\. Press Enter once patching has finished and rootAVD prompts you.  
 9\. Wait for rootAVD to finish copying the modified image.  
TBD DE QUE NO DEBE DE HABER MAS DE 1 DISPOSITIVO POR ADB, SI NO EL ROOTAVD FALLA.   
 **Do not close the terminal or emulator while the image is being modified.**

###  Restart and check Magisk

 1\. After rootAVD finishes, stop the emulator if it is still running.  
 2\. In Device Manager, open the device’s menu.  
 3\. Select Cold Boot or Cold Boot Now.  
 4\. Wait for Android to start.  
 5\. Open Magisk.  
 6\. If prompted to complete additional setup, accept and allow the restart.  
 7\. Check that Magisk displays “Yes” on “Zygisk” and “Ramdisk”:  
![][image1]

#### Install Frida Server in the device

We will use a Magisk Module called MagiskFrida.   
This module starts frida-server when Android boots.  
**Note**: The pinned frida-server version for this laboratory is **17.18.0-1.**

1. Download the [MagiskFrida ZIP release](https://github.com/ViRb3/magisk-frida/releases/tag/17.18.0-1) for the pinned version. Do not unzip the file.  
2. Drag the ZIP file from your computer into the mobile emulator window.  
3. Wait for the transfer to finish. The file will appear in the Download directory of the device.  
4. Open Magisk \> Open Modules Tap Install from storage.  
5. Open Download and select the MagiskFrida ZIP file.

![][image2]

6. Wait for installation to finish.

![][image3]

7. Tap Reboot.  
8. After restarting, open Magisk → Modules.  
9. Check that MagiskFrida is installed and enabled **and shows “active”. If “active” does not show, click on “Action” or reboot the device until it appears “active”** .

![][image4]

#### Install the Frida tools on your computer

The previously installed module installs the server inside Android. You also need the Frida client tools on your computer.

1. Download and install **Python 3.9.6** for your machine.  
2. Create a virtual environment using Python and activate it: 

`python3 -m venv "$HOME/mobile-workshop-venv"`  
`source "$HOME/mobile-workshop-venv/bin/activate"`

3. Install the tools and the Frida version matching the Magisk module:

   `python -m pip install frida-tools "frida==17.18.0"`

In this case, MagiskFrida-17.18.0-1.zip corresponds to frida==17.18.0. The \-1 suffix belongs to the module release.  
Do not confuse the frida-tools version with the frida version. They use different version numbers.

### Check the Frida connection

With the emulator running and the Python environment activated, run the following command to verify that Frida client and server are able to communicate:  
`frida -U -f com.android.settings`  
The Android settings application should spawn in the device. The Frida CLI (REPL) should appear in the console.  
![][image5]

## Additional notes

* Once your environment passes these checks, do not update the Android system image, Magisk, or Frida before the workshop.  
* If any of the steps fail, send the organizers your platform, installed versions, and the complete error message.

[image1]: <attachments/images/image1.png>

[image2]: <attachments/images/image2.png>

[image3]: <attachments/images/image3.png>

[image4]: <attachments/images/image4.png>

[image5]: <attachments/images/image5.png>
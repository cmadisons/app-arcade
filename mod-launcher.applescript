-- Mod Launcher: opens Minecraft with one of the user's Fabric mods.
-- The App Arcade links to mcmod://<mod-folder>, e.g. mcmod://ship-life
property javaHome : "/Users/themadison/Library/Application Support/minecraft/runtime/java-runtime-epsilon/mac-os/java-runtime-epsilon/jre.bundle/Contents/Home"
-- Every mod in ~ that has a gradlew and builds. The list is a safety catch:
-- the URL names a folder to run gradlew in, so it has to be a folder we chose,
-- not one the link gets to pick.
property allowedMods : {"ship-life", "zelda-mod", "skyblock-mod", "blueprint-mod", "random-teleport", "world-downloader", "example-mod"}

on open location theURL
	set modName to text 9 thru -1 of theURL -- drop "mcmod://"
	if modName ends with "/" then set modName to text 1 thru -2 of modName
	if allowedMods does not contain modName then
		display dialog "Mod Launcher doesn't know the mod \"" & modName & "\"." buttons {"OK"} default button 1
		return
	end if
	set cmd to "clear; echo 'Starting Minecraft with " & modName & "... (the first start takes a minute)'; export JAVA_HOME=" & quoted form of javaHome & "; cd ~/" & modName & " && ./gradlew --offline runClient -Dorg.gradle.java.home=\"$JAVA_HOME\" || ./gradlew runClient -Dorg.gradle.java.home=\"$JAVA_HOME\""
	tell application "Terminal"
		activate
		do script cmd
	end tell
end open location

on run
	display dialog "Mod Launcher opens Minecraft with your mods. Use it from the App Arcade." buttons {"OK"} default button 1
end run

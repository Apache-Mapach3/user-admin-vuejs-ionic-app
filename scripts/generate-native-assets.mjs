import { existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// Run from the project root. Rasterization uses librsvg's rsvg-convert CLI.
function rasterize(source, destination, size) {
  const result = spawnSync('rsvg-convert', ['--width', String(size), '--height', String(size), '--output', destination, source], { stdio: 'inherit' });
  if (result.error || result.status !== 0) throw result.error || new Error(`Could not generate ${destination}`);
}
const densities = { mdpi: [48, 108], hdpi: [72, 162], xhdpi: [96, 216], xxhdpi: [144, 324], xxxhdpi: [192, 432] };
for (const [density, [icon, foreground]] of Object.entries(densities)) {
  const directory = `android/app/src/main/res/mipmap-${density}`;
  if (!existsSync(directory)) continue;
  rasterize('assets/nexo.svg', `${directory}/ic_launcher.png`, icon);
  rasterize('assets/nexo.svg', `${directory}/ic_launcher_round.png`, icon);
  rasterize('assets/nexo.svg', `${directory}/ic_launcher_foreground.png`, foreground);
}
const iosIcon = 'ios/App/App/Assets.xcassets/AppIcon.appiconset';
if (existsSync(iosIcon)) rasterize('assets/nexo.svg', `${iosIcon}/AppIcon-512@2x.png`, 1024);
const iosSplash = 'ios/App/App/Assets.xcassets/Splash.imageset';
if (existsSync(iosSplash)) for (const file of readdirSync(iosSplash).filter(name => name.endsWith('.png'))) rasterize('assets/splash.svg', `${iosSplash}/${file}`, 2732);

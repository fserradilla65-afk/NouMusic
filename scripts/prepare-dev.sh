set -e

sed -i 's/jp.nonbili.noutube/jp.nonbili.noumusic_dev/' app.config.ts
sed -i 's/NouMusic/NouMusic-dev/' app.config.ts
yes | bun expo prebuild -p android --clean --no-install

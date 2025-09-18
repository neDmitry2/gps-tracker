const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Содержимое для network_security_config.xml
const networkSecurityConfig = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
`;

// Плагин для изменения AndroidManifest.xml (остается без изменений)
const withNetworkSecurityConfig = (config) => {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    application.$['android:networkSecurityConfig'] = '@xml/network_security_config';
    return config;
  });
};

// Экспортируем один плагин, который делает всё необходимое
module.exports = (config) => {
  // Сначала применяем изменение к манифесту
  config = withNetworkSecurityConfig(config);
  
  // Затем "опасно" модифицируем файлы, чтобы создать network_security_config.xml
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const resPath = path.join(projectRoot, 'android/app/src/main/res');
      const xmlPath = path.join(resPath, 'xml');
      const filePath = path.join(xmlPath, 'network_security_config.xml');

      // Создаем папку /xml, если ее нет
      if (!fs.existsSync(xmlPath)) {
        fs.mkdirSync(xmlPath, { recursive: true });
      }
      // Записываем файл
      fs.writeFileSync(filePath, networkSecurityConfig);

      return config;
    },
  ]);
};
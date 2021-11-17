import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCAYjJNTDWSTJ8RBnZ9hp7AS8eF\n' +
  'JvxpuZYTqGjD8qak45DKkAhpi7SNXDNbfDXNbUFeH465hwQIznS5fHdWgUAoqByG\n' +
  'jHoYu1jRhDx72EgKhuvDQ3sxwLJr0Ynx1f1Ny9yt8wtLaVc9KcJ8m/pHmmAGz+xf\n' +
  '7rzZ8dJvnee+OHMkNwIDAQAB'

const privateKey = 'MIICXAIBAAKBgQCAYjJNTDWSTJ8RBnZ9hp7AS8eFJvxpuZYTqGjD8qak45DKkAhp\n' +
  'i7SNXDNbfDXNbUFeH465hwQIznS5fHdWgUAoqByGjHoYu1jRhDx72EgKhuvDQ3sx\n' +
  'wLJr0Ynx1f1Ny9yt8wtLaVc9KcJ8m/pHmmAGz+xf7rzZ8dJvnee+OHMkNwIDAQAB\n' +
  'AoGADt3lhPr8FybP+BOUrsDjQFG7gelRAIM7uadeXmvf1/ym5zYaVfKWJBUsY1M1\n' +
  'ExwBnlSEMsAg+6Nrc+anFnmILsulPGdrSm3fwPKwhzlrwXd0zl3AK3Mz8GK08CIn\n' +
  'Y6KGM0z0tQ1CIC+b+ilMUjquhOAyS041f2FbN7FEXLoS/tUCQQCEDckdx0syO5em\n' +
  'YSdVtQrCumrH0ZRWHr2QOHXX/0Srz5rPyHcgfjOr0oi3aPAY9zduBcaWswKGjqvQ\n' +
  'gn+QRYQbAkEA+OKCeACCpPQ5jb+9cRLNpO+rUnDDe1zItSTiZ+qljla34BgbZiZJ\n' +
  'MW1N1KnesXVUFWg1q6UbtCa5ruNujabKFQJAJn3aNKrl2VOThbTmAU6PP2mVPH9z\n' +
  'jJLTUJmUiAxpWOdfydc2GiuPJjNtFIErEyvkZVabp0uwncYygMm5IzWQJwJBAL6X\n' +
  'Xwgcg+9kIyrcuWr81kRHUTApsFko/X5Sh5rCgxOUbu0KKPk5unVCWgbQKvxEeCaI\n' +
  'jgkqwCNeQHWgLsoE/t0CQEHHJG3Djcl9Ok6N6emZunGoBP83+iPlQ1aoq+K6tXBO\n' +
  'TDHkswl7VTyfphhDfMDrgX9e3B+6HvswxqvgU+ATZbA='

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}


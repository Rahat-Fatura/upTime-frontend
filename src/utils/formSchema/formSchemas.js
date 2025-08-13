import * as yup from 'yup'

export const registerFormSchema = yup.object().shape({
  username: yup.string().required('Kullanıcı adınız boş olamaz'),
  email: yup
    .string()
    .email('Lütfen email formatınızı kontrol edin !')
    .required('Email alanı boş olamaz'),
  password: yup
    .string()
    .required('Lütfen şifrenizi giriniz')
    .test(
      'passwordFormat',
      (value) => {
        if (value.length < 8) {
          return 'Şifre en az 8 karakterden oluşmalıdır'
        }
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return 'Şifre en az 1 harf ve 1 rakam içermelidir'
        }
      },
      (value) => {
        if (value.length < 8) {
          return false
        }
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return false
        }
        return true
      }
    ),
  agree: yup
    .boolean()
    .isTrue('Gizlilik politikası ve şartlarını onaylanması zorunda !')
    .required('Gizlilik politikası ve şartlarını onaylanması zorunda !'),
})

export const loginFormShcema = yup.object().shape({
  email: yup
    .string()
    .email('Lütfen email formatınızı kontrol edin !')
    .required('Email alanı boş olamaz'),
  password: yup
    .string()
    .required('Lütfen şifrenizi giriniz')
    .test(
      'passwordFormat',
      (value) => {
        if (value.length < 8) {
          return 'Şifre en az 8 karakterden oluşmalıdır'
        }
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return 'Şifre en az 1 harf ve 1 rakam içermelidir'
        }
      },
      (value) => {
        if (value.length < 8) {
          return false
        }
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return false
        }
        return true
      }
    ),
})

export const landingFormSchema = yup.object().shape({
  name: yup.string().required('Adınız belirtilmesi zorunda'),
  email: yup
    .string()
    .email('Lütfen email formatınızı kontrol edin !')
    .required('Email alanı boş olamaz'),
  message: yup.string().required('Mesaj alanı boş olamaz'),
})

export const forgotPasswordFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Lütfen email formatınızı kontrol edin !')
    .required('Email alanı boş olamaz'),
})

export const resetPasswordFormSchema = yup.object().shape({
  password: yup
    .string()
    .required('Lütfen şifrenizi giriniz')
    .min(8, 'Şifre en az 8 karakterden oluşmalıdır')
    .test(
      'passwordFormat',
      'Şifre en az 1 harf ve 1 rakam içermelidir',
      (value) => {
        if (!String(value).match(/\d/) || !String(value).match(/[a-zA-Z]/)) {
          return false
        }
        return true
      }
    ),
  verifyPassword: yup
    .string()
    .required('Lütfen Şifrenizi Doğrulayın')
    .oneOf([yup.ref('password')], 'Şifreler eşleşmiyor'),
})

export const newHttpMonitorFormShhema = yup.object().shape({
  name: yup.string().required('Ad alanı takip etmeniz için zorunludur !'),
  method: yup
    .string()
    .oneOf(
      ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTION'],
      'Geçersiz başlık !'
    )
    .required('İstek atabilmek için önemlidir !'),
  host: yup
    .string()
    .url('Geçersiz host adresi !')
    .required('Url alanı zorunludur !'),
  body: yup
    .string()
    .test('is-json', 'Monitor Gövdesi Json Formatında Değil !', (value) => {
      try {
        if (value.length > 0) {
          try {
            let duzeltilmis = value.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
            JSON.parse(duzeltilmis)
            return true
          } catch (error) {
            return false
          }
        }
      } catch (error) {
        console.log(error)
        return true
      }
    }),
  headers: yup
    .string()
    .test('is-json', 'Monitor Başlığı  JSON Formatında Değil !', (value) => {
      try {
        if (value.length > 0) {
          try {
            let duzeltilmis = value.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
            JSON.parse(duzeltilmis)
            return true
          } catch (error) {
            return false
          }
        }
      } catch (error) {
        console.log(error)
        return true
      }
    }),
  timeOut: yup
    .number()
    .test('check-timeoutvalue', 'Hatalı Değer', (value) =>
      typeof value === 'number' ? true : false
    ),
  interval: yup.number().required('İstek zaman birimi zorunludur!'),
  intervalUnit: yup
    .string()
    .oneOf(['seconds', 'minutes', 'hours'], 'Geçersiz zaman birimi!')
    .required('Zaman Birimi Zorunludur!'),
  allowedStatusCodes: yup
    .string()
    .test(
      'is-valid-status-list',
      'Lütfen Girdinizi Kontrol Ediniz !',
      (value) => {
        try {
          let flag
          if (value.length > 0) {
            let array = String(value).split(',')
            array = array.map(Number)
            flag = array.every((code) => code >= 100 && code < 600)
          } else {
            flag = true
          }
          return flag
        } catch (error) {
          return true
        }
      }
    ),
  failCountRef: yup
    .number()
    .min(1, 'Başarısızlık sayısı en az 1 olmalıdır !')
    .required('Başarısızlık sayısı zorunludur !'
    ),
  slowResponseAlertStatus: yup
    .boolean()
    .required('İşaretlenesi Önemlidir !'),
  slowResponseAlertValue: yup
    .string()
    .required('Zaman birimi girilmelidir.')
    .test(
      'is-valid-slowResponseValue',
      'Geçerli bir zaman birimini girin !',
      (value) => {
        const slowResponseAlertValue = Number(value)
        return Number.isInteger(slowResponseAlertValue)
      }
    ),
})

export const newKeywordMonitorFormShhema = yup.object().shape({
  name: yup.string().required('Ad alanı takip etmeniz için zorunludur !'),
  method: yup
    .string()
    .oneOf(
      ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH', 'OPTION'],
      'Geçersiz başlık !'
    )
    .required('İstek atabilmek için önemlidir !'),
  host: yup
    .string()
    .url('Geçersiz url adresi !')
    .required('Url alanı zorunludur !'),
  body: yup
    .string()
    .test('is-json', 'Monitor Gövdesi Json Formatında Değil !', (value) => {
      try {
        if (value.length > 0) {
          try {
            let duzeltilmis = value.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
            JSON.parse(duzeltilmis)
            return true
          } catch (error) {
            return false
          }
        }
      } catch (error) {
        console.log(error)
        return true
      }
    }),
  headers: yup
    .string()
    .test('is-json', 'Monitor Başlığı  JSON Formatında Değil !', (value) => {
      try {
        if (value.length > 0) {
          try {
            let duzeltilmis = value.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":')
            JSON.parse(duzeltilmis)
            return true
          } catch (error) {
            return false
          }
        }
      } catch (error) {
        console.log(error)
        return true
      }
    }),
  keyWordType: yup
    .string()
    .oneOf(['txt', 'html', 'json'], 'Geçersiz Tip !')
    .required('Anahtar tip alanı zorunludur !'),
  keyWord: yup
    .string()
    .when('keyWordType', (type, schema) => {
      console.log("Type ",type[0])
      switch (type[0]) {
        case 'txt': {
          console.log('Txt a geldi:',schema)
          return schema
            .min(1, 'Anahtar kelime alanı boş olamaz !')
            .required('Anahtar kelime alanı boş olamaz !')
        }
        case 'html': {
          console.log('Html a geldi:',schema)
          return schema.test(
            'is-html',
            'HTML tipi için geçerli bir HTML etiketi girin',
            (value) => {
              
                if (value) {
                  const regex = /^<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>[\s\S]*<\/\1>$/;
                  return regex.test(value.trim());
                } else {
                  return true
                }
            }
          ).required('Anahtar kelime alanı boş olamaz !')
        }
        case 'json': {
          console.log('Json a geldi:',schema)
          return schema.test(
            'is-json',
            'Anahtar kelime json formatında değil !',
            (value) => {
              try {
                if (value.length > 0) {
                  try {
                    let duzeltilmis = value.replace( 
                      /([{,]\s*)(\w+)\s*:/g,
                      '$1"$2":'
                    )
                    JSON.parse(duzeltilmis)
                    return true
                  } catch (error) {
                    return false
                  }
                }
              } catch (error) {
                console.log(error)
                return true
              }
            }
          ).required('Anahtar kelime alanı boş olamaz !')
        }
        default: {
          return schema
        }
      }
    }),
  timeOut: yup
    .number()
    .test('check-timeoutvalue', 'Hatalı Değer', (value) =>
      typeof value === 'number' ? true : false
    ),
  interval: yup.number().required('İstek zaman birimi zorunludur!'),
  intervalUnit: yup
    .string()
    .oneOf(['seconds', 'minutes', 'hours'], 'Geçersiz zaman birimi!')
    .required('Zaman birimi zorunludur!'),
  allowedStatusCodes: yup
    .string()
    .test(
      'is-valid-status-list',
      'Lütfen girdinizi kontrol ediniz !',
      (value) => {
        try {
          let flag
          if (value.length > 0) {
            let array = String(value).split(',')
            array = array.map(Number)
            flag = array.every((code) => code >= 100 && code < 600)
          } else {
            flag = true
          }
          return flag
        } catch (error) {
          return true
        }
      }
    ),
  failCountRef: yup
    .number()
    .min(1, 'Başarısızlık sayısı en az 1 olmalıdır !')
    .required('Başarısızlık sayısı zorunludur !')
})

export const newPingMonitorFormShhema = yup.object().shape({
  name: yup.string().required('Ad alanı takip etmeniz için zorunludur !'),
  host: yup
    .string()
    .test('', 'Geçerli bir IP veya URL adresi girin.', (value) => {
      const hostnameRegex =
        /^(?=.{1,253}$)(?!\-)([a-zA-Z0-9\-]{1,63}\.)+[a-zA-Z]{2,}$/
      const ipRegex =
        /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/
      return ipRegex.test(value) || hostnameRegex.test(value)
    })
    .required('Host alanı zorunludur !'),
  interval: yup.number().required('İstek zaman birimi zorunludur!'),
  intervalUnit: yup
    .string()
    .oneOf(['seconds', 'minutes', 'hours'], 'Geçersiz zaman birimi!')
    .required('Zaman birimi zorunludur!'),
  failCountRef: yup
    .number()
    .min(1, 'Başarısızlık sayısı en az 1 olmalıdır !')
    .required('Başarısızlık sayısı zorunludur !')
})

export const newPortMonitorFormShhema = yup.object().shape({
  name: yup.string().required('Ad alanı takip etmeniz için zorunludur !'),
  host: yup
    .string()
    .test('', 'Geçerli bir IP veya URL adresi girin.', (value) => {
      try {
        new URL(value)
        return true
      } catch (e) {}
      const hostnameRegex =
        /^(?=.{1,253}$)(?!\-)([a-zA-Z0-9\-]{1,63}\.)+[a-zA-Z]{2,}$/
      const ipRegex =
        /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/
      return ipRegex.test(value) || hostnameRegex.test(value)
    })
    .required('Host alanı zorunludur !'),
  port: yup
    .string()
    .required('Port girilmelidir.')
    .test(
      'is-valid-port',
      'Geçerli bir port numarası girin (0-65535).',
      (value) => {
        const port = Number(value)
        return Number.isInteger(port) && port >= 0 && port <= 65535
      }
    ),
  interval: yup.number().required('İstek zaman birimi zorunludur!'),
  intervalUnit: yup
    .string()
    .oneOf(['seconds', 'minutes', 'hours'], 'Geçersiz zaman birimi!')
    .required('Zaman birimi zorunludur!'),
  failCountRef: yup
    .number()
    .min(1, 'Başarısızlık sayısı en az 1 olmalıdır !')
    .required('Başarısızlık sayısı zorunludur !')
})

export const newCronJobMonitorFormShhema = yup.object().shape({
  name: yup.string().required('İsim alanı takip etmeniz için zorunludur !'),
  divitionTime: yup
    .string()
    .required('Sapma zamanı girilmelidir.')
    .test(
      'is-valid-divition-time',
      'Sapma zamanı dakika cinsinden girin (0-59).',
      (value) => {
        const time = Number(value)
        return Number.isInteger(time) && time >= 0 && time <= 59
      }
    ),
  interval: yup.number().required('İstek zaman birimi zorunludur!'),
  intervalUnit: yup
    .string()
    .oneOf(['seconds', 'minutes', 'hours'], 'Geçersiz zaman birimi!')
    .required('Zaman birimi zorunludur!'),
  failCountRef: yup
    .number()
    .min(1, 'Başarısızlık sayısı en az 1 olmalıdır !')
    .required('Başarısızlık sayısı zorunludur !')
})

const RSA_KEY_PUBLIC = 'RSA_KEY_PUBLIC';
const priK = "RSA_KEY_PRIVATE";

$('#btn_submit').click(function(){
    let aesKey =  randomString(16)
    let randomKey = encryptAesKsy(aesKey);

    //Example data, this will come from input field of Form or directly drom another APi call.
    let param = {
        "diallingCode":"+421",
        "mobile":"912345678"
    }
    let bizDataEncrypt = encryptParam(aesKey, param);
    let obj = BRequest(parseDate(),aesKey,JSON.stringify(param))
    let signDataString = objTransformation(obj);
    console.log(signDataString)
    let signature = new KJUR.crypto.Signature({alg:"SHA256withRSA",prvkeypem:'-----BEGIN PRIVATE KEY-----' + priK + '-----END PRIVATE KEY-----'});
    signature.updateString(signDataString);
    let sign = hextob64(signature.sign());
    obj.bizData = bizDataEncrypt
    obj.randomKey= randomKey
    obj.signType = "RSA"
    obj.signature = sign
    console.log(obj)
});

//Splicing parameters
function objTransformation(obj){
    let str = '';
    for(let key in obj){
        str += key + '=' + obj[key];
        str += '&';
    }
    str = str.slice(0, -1);
    return str;
}

//RSA encryption
function encryptParam(aesKey, param){
    let key = CryptoJS.enc.Utf8.parse(aesKey);
    let encrypt = CryptoJS.AES.encrypt(JSON.stringify(param), key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    let bizDataEncrypt = encrypt.toString();
    return bizDataEncrypt;
}

//Sort
function objKeySort(obj) {
    let newkey = Object.keys(obj).sort();
    let newObj = {};
    for (let i = 0; i < newkey.length; i++) {
        newObj[newkey[i]] = obj[newkey[i]];
    }
    return newObj;
}

function pad2(n) {
    return n < 10 ? '0' + n : n
}

//Get Timestamp
function parseDate(){
    let date = new Date();
    let time = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2( date.getDate()) + pad2( date.getHours() ) + pad2( date.getMinutes() ) + pad2( date.getSeconds() )
    return time;
}

//Build parameters
function BRequest(requestId,randomKey,bizData){
    let BRequest ={
        requestId: requestId,
        agentId: '888666000100245',
        version: "2.0",
        randomKey:randomKey,
        bizData:bizData,
    }
    return objKeySort(BRequest);
}

//Encrypt AesKey
function encryptAesKsy(aesKey){
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey('-----BEGIN PUBLIC KEY-----' + RSA_KEY_PUBLIC + '-----END PUBLIC KEY-----');
    let encrypted = encrypt.encrypt(aesKey);
    return encrypted;
}

//Get 16 bit random characters
function randomString(len){
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    let tempLen = chars.length, tempStr='';
    for(let i=0; i<len; ++i){
        tempStr += chars.charAt(Math.floor(Math.random() * tempLen ));
    }
    return tempStr;
}
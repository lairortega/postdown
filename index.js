const fs = require("fs")
const postman = require(process.argv[2])
const output = process.argv.length > 3 ? process.argv[3] : process.argv[2] + '.md';
let MD = `# ${postman.info.name}\n`;
for(var folder = 0; folder < postman.item.length; folder++){
    MD += `## ${postman.item[folder].name}\n`
    for(var request = 0; request < postman.item[folder].item.length; request++){
        MD += `### ${postman.item[folder].item[request].name}\n`
        MD += `#### Request\n`
        MD += `${postman.item[folder].item[request].request.description ? postman.item[folder].item[request].request.description : ''}\n`
        MD += `**${postman.item[folder].item[request].request.method}** ${postman.item[folder].item[request].request.url.raw}\n`
        if(postman.item[folder].item[request].request.header.length > 0){
            MD += `##### Headers\n`
            for(var reqHeader = 0; reqHeader < postman.item[folder].item[request].request.header.length; reqHeader++){
                MD += `- ${postman.item[folder].item[request].request.header[reqHeader].key}: ${postman.item[folder].item[request].request.header[reqHeader].value}\n`
            }
        }
        if(postman.item[folder].item[request].request.body){
            MD += `##### Body\n`
            MD += '```' + postman.item[folder].item[request].request.body.options.raw.language + '\n' + postman.item[folder].item[request].request.body.raw+ '\n```\n'
        }
        if(postman.item[folder].item[request].response.length > 0){
            MD += `#### Response\n`
            let responseType = ''
            for(var response = 0; response < postman.item[folder].item[request].response.length; response++){
                MD += `${postman.item[folder].item[request].response[response].status} ${postman.item[folder].item[request].response[response].code}\n`
                // console.log(postman.item[folder].item[request].response[response])
                MD += `##### Headers\n`
                for(var responseHeader = 0; responseHeader < postman.item[folder].item[request].response[response].header.length; responseHeader++){
                    MD += `- ${postman.item[folder].item[request].response[response].header[responseHeader].key}: ${postman.item[folder].item[request].response[response].header[responseHeader].value}\n`
                    if(/(content-type)/ig.test(postman.item[folder].item[request].response[response].header[responseHeader].key)){
                        responseType = postman.item[folder].item[request].response[response].header[responseHeader].value.split("/")[1]
                    }
                }
                if(postman.item[folder].item[request].response[response].body){
                    MD += `##### Content\n`
                    MD += '```' + responseType + '\n' + postman.item[folder].item[request].response[response].body + '\n```\n'
                }
            }
        }
    }
}
fs.writeFile(output, MD, function(e, r){
    if(e){
        throw e
    }
})
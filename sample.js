var _=require('lodash')
var async =require('async')
var request =require('request')
var token ='ZGluZXNoLnZlbmthdEBjZWxpZ28uY29tOmRpbmVzaDI2NDk2'
var expressObj= {
    hooks:{
        itemExportPreSavePageHook: function(options,callback){
            var responseData={
                data:[],
                errors:[{code:'',message:'',source:''}]
            };
            if(!options.data){
                responseData.errors =[{
                    code:'200',
                    message:'Error in the export data, Data is missing!!',
                    source: 'netsuite export'
                }]
                responseData.data=[]
                callback(null,responseData)
            }
            //for NS to REST 
            else {
                var obj={}
                async.eachSeries(options.data,function(data,callback){
                    obj = _.find(data,function(object){
                        return object.id == 6950;     
                    })
                    if(!_.isNull(obj))  callback(obj)
                },function(record){
                    responseData.data.push(record)
                    responseData.errors=[]
                    callback(null,responseData)
                })
                
                //console.log(JSON.stringify(obj));
                console.log(JSON.stringify(options.data)+'\n');
                //console.log('\n'+JSON.stringify(options)+'\n');
            }

            //for FTP to NS 
            // else {
            //     var obj={}
            //     obj = _.find(options.data,function(object){
            //         return object.EntityID == 'personA2';     
            //     })
            //     console.log(JSON.stringify(options.data));
            //     console.log(JSON.stringify(obj));

            //     responseData.data.push(obj)
                
            //     responseData.errors=[]
            // }
            // return callback(null,responseData)
        },
        itemImportPreMapHook : function(options,callback){
            var responseData =[{
                data:[],
                errors:[{code:'',message:'',source:''}]
            }]
            if(_.isEmpty(options.data)&&!(_.isArray(options.data))){
                responseData.errors.forEach(object=>{
                    object.code='200'
                    object.message='Error in the received data, Data is missing!!'
                    object.source= 'netsuite export'
                })
                // responseData.errors =[{
                //     code:'200',
                //     message:'Error in the received data, Data is missing!!',
                //     source: 'netsuite export'
                // }]
                responseData.data=[]
            }
            else{
                //console.log('\n'+JSON.stringify(options.data)+'\n');

                options.data.forEach(record=>{
                    var newObj={}
                    for(k in record){
                        if(!_.isNull(record[k])&&!_.isEmpty(record[k])) newObj[k] = record[k]
                    }
                    responseData[0].data.push(newObj)
                    responseData[0].errors=[]
                })
                
                //options.data[0].Name='nEw nAmE'
                //options.data[0][0].NameId=options.data[0][0].Name
                //delete options.data[0][0].Name
                //responseData[0].data=options.data[0]
                
                console.log("After preMap:"+JSON.stringify(responseData[0].data));

            }
            
            
            return callback(null,responseData)

        },
        itemImportPostMapHook : function(options,callback){
            var responseData =[{
                data:[],
                errors:[{
                    code:'',
                    message:'',
                    source:''
                }]
            }]
            if(_.isEmpty(options.preMapData)&&!(_.isArray(options.preMapData))){
                responseData.errors.forEach(object=>{
                    object.code='200'
                    object.message='Error in the received data, Data is missing!!'
                    object.source= 'netsuite export'
                })
                // responseData.errors =[{
                //     code:'200',
                //     message:'Error in the received data, Data is missing!!',
                //     source: 'netsuite export'
                // }]
                responseData[0].data=[]
            }
            else{
                console.log('\n'+JSON.stringify(options.preMapData)+'\n');

                options.preMapData.forEach(record=>{
                    var newObj={}
                    record[0].Name='nEw nAmE'
                    record[0].recordType='myRecordMyWish'
                    responseData[0].data =options.preMapData
                    responseData[0].errors=[]
                })
                
                //options.data[0].Name='nEw nAmE'
                //options.data[0][0].NameId=options.data[0][0].Name
                //delete options.data[0][0].Name
                //responseData[0].data=options.data[0]
                
                console.log("After PostMap:"+JSON.stringify(responseData[0].data));

            }
            
            
            return callback(null,responseData)

        },
        itemImportPostSubmitHook : function(options,callback){
            var responseData =[{ 
                statusCode: 200/422/403,
                errors: [{code:'', message:''}], 
                ignored: true/false, 
                id: '', 
                _json: {}, 
                dataURI: '' 
            }]
            if(!options.responseData){
                responseData[0].errors = [{
                    code:'401',
                    message:'an error object to signal a fatal exception and will fail the entire page of records!!'
                }]
                return callback(null,responseData)
            }
            else{
                responseData[0].statusCode = 200
                responseData[0].ignored =false
                responseData[0].errors=[]
                console.log('After PostSubmit, the response is submitted!!!'+JSON.stringify(responseData));
                return callback(null,responseData)
            }
        }
    },
    wrappers :{
        pingConnectionWrapper: function(options, callback){
            var response ={
                statusCode: 200/401,
                errors: [{message: 'error message', code: 'error code'}]
            }
            if(!options){
                response.errors =[{
                    code:'401',
                    message:'a fatal error has occurred. This will halt the Whole call!!'
                }]
                response.statusCode= 401
                return callback(null,response)
            }
            else {
                response.statusCode=200
                response.errors=[]
                return callback(null,response)
            }
        },
        itemExportWrapper: function(options,callback){
            var response = {
                connectionOffline: true/false,
                data: [],
                errors: [{message: 'error message', code: 'error code'}],
                lastPage: true/false,
                state:{}
            }
            if(!options){
                response.errors = [{
                    code:'401',
                    message:'a fatal error has occurred. This will halt the export process!!'
                }]
                return callback(null,response)
            }
            else{
                response.connectionOffline=false
                response.data =[{
                    Name:'WrapperItem',
                    Id: 789654123,
                    Subsidiary:'Dinesh s Subsidiary'                
                }]
                response.lastPage =true
                response.errors=[]
                return callback(null,response)
            }
        },
        itemImportWrapper: function(options,callback){
            var response =[{
                statusCode: 200/401/422,
                id:'123654789',
                ignored: null,
                errors: [{code:'', message:''}]
            }]
            var option ={
                uri :'http://demo4227544.mockable.io/getItemusingHook ',
                method:'POST',
                headers:{
                    Authorization:'Basic '+token,
                    'Content-Type':'application/json',
                    'charset':'utf8'
                },
                json:options.postMapData
            }
            console.log(JSON.stringify(options.postMapData));
            
            request(option,function(error,response,body){
                if(error) console.log(error);
                else console.log('success!!!');         
            })      
           
            if(!options){
                response[0].errors = [{
                    code:'401',
                    message:'a fatal error has occurred. This will halt the import process!!'
                }]
                return callback(null,wrapperResponse)
            }
            else{
                response[0].statusCode=200,
                response[0].ignored=false,
                response[0].errors=[]
                console.log('The response is submitted!!!'+JSON.stringify(response));
                return callback(null,response)
            }            
        }
    }
}
module.exports = expressObj
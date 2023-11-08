# aio-service is a dependency for handle all apis and server requests in your application
# install
npm i aio-service
``` javascript
```
# import
``` javascript
import AIOService from 'aio-service'; 
```
# create instance
``` javascript
import myApiFunctions from './my-api-function';

let apis = new AIOService({
    id:'my app',
    getApiFunctions:myApiFunctions,
    token:'......',
    baseUrl:'https://my-route/api/v1', 
    onCatch:(error)=>{
        if(error.response){
            return error.response.data.Message
        }
    }, 
    getError:(response)=>{
        if(!response.data.isSuccess){return response.data.message}
    },
    loader:<Loading/>,
})

this.setState({apis});
```
- `id` required - string - should set a uniq id.
- `getApiFunctions` required - function - returns an object contain api functions
- `token` optional - string - this token will set on all requests
- `baseUrl` optional - string - set base url
- `onCatch` optional - function - get catched requests response and should returns an string as error message
- `getError` optional - function - get each requests response and if is there any error should returns an string as error message
- `loader` optional - html/jsx - set custom loader

# getApiFunctions property
> you should write a function as getApiFunctions that returns an object contain api functions.

> in your project you can write all requests in this function and you can call them in all over your app.

> getApiFunctions get an object as parameter contain:
- `Axios` Axios dependecy for requests , use this for prevent import it
- `baseUrl` base url (in creation of instance).

> each functin take 2 parameters :
- `parameter` is parameter of function that you can call api function by it.
- `appState` is return result of getState function. this is for read app information in all api functions for prevent send any thing to these functions.

> each function should returns an object contain :
- `response` return response for error handling.
- `result` return result of request to your app.

> [!NOTE]
result can have any types exept strings. <br>
if result type be an string that means you returns an error and this string will show to user as alert. <br>
if you want to return an string result you should put it in an object and send it as result. <br>

``` javascript
function myApiFunctions({Axios,baseUrl}){
    return {
        async getUserInfo(parameter,appState){
            let url = `${baseUrl}/GetUserInfo`;
            let response = await Axios.get(url);
            let result = response.data.UserInfo;
            return {response,result}
        },
        async getMyOrders(parameter,appState){
            let url = `${baseUrl}/GetOrders`;
            let body = {
                userId:appState.userInfo.id,
                orderType:parameter
            }
            let response = await Axios.post(url,body);
            let result = response.data.data;
            return {response,result}
        }
    }
}
```
# 1 - instance methods(request)
`apis.request` in all over of your app wherever you have access to instance of AIOService class, you can call api functions by call instance.request method
``` javascript
const apis = new AIOService({...});
let res = await apis.request({
    api:'getMyOrders',
    parameter:0,
    description:'get user info',
    onSuccess:(result)=>{
        //for example this.setState({users:result})
    },
    onError:()=>{//optional
        //for example this.close()
    },
    def:[],
    message:{
        error:'my custom error message',
        success:true
    },
    cache:{
        name:'cache name',
        time:24 * 60 * 60 * 1000
    },
    loading:false,
    loadingParent:'.my-box',
    token:'....',
    getError:(response)=>!response.data.isSuccess?response.data.message
})
```
- `api` required - name of api function that writed in getMyApiFunction return object
- `parameter` value that api function will take as parameter (in this example 0)
- `description` description of action. use in generate alert messages
- `onSuccess` optional - A function that is called with the result if the request is successful. dont need async and await
- `onError` optional - A function that is called in case of an error in the request
- `def` optional - any types - In case of error, this value will be returned as a result
- `message` optional - handle alert messages of request
- `message.error` set false for prevent show error alert, set string for show custom message as alert
- `message.success` set true for alert success message automatically. set string for alert custom success message. if not set , success message will not show
- `cache` optional - you can set cache for api function result and next time result will read from cache storage
- `cache.name` name of cache for isolate cache results
- `cache.time` set a number to set time of caching. for example if you set 24 * 60 * 60 * 1000 , api function result will cache for 24 hours
- `loading` for prevent show loader set loading false. default is true,
- `loadingParent` optional - you can set container selector of loading, by default will render in center of screen
- `token` optional - If you have set the token in the instance creation, you dont need to set the token here
- `getError` optional - If you have set the getError in the instance creation, you dont need to set it here

# 2 - instance methods ( setToken )
`apis.setToken` change token of instance by call instance.setToken(token)
``` javascript
apis.setToken(token);
```
# 3 - instance methods ( getCache )
apis.getCache get chached object that is contain of all cached api functions result
``` javascript
let cacheModel = apis.getCache();
```
# 4 - instance methods ( setCache )
apis.setCache change a cached value
``` javascript
// first parameter is cache name and second parameter is value to change
apis.setCache('orders',[]);
```
# 5 - instance methods ( removeCache )
apis.removeCache remove a cached value
``` javascript
// parameter is name of cached value to remove
apis.removeCache('orders');
```
# 6 - instance methods ( setProperty )
apis.setProperty change properties of instance
``` javascript
apis.setProperty('getState',()=>this.state);
apis.setProperty('loader',<Loading/>);
apis.setProperty('baseUrl','https://apis/v1');
```

# manage api functions
get-api-functions.js
``` javascript
import userApiFunctions from './user-api-functions';
import orderApiFunctions from './order-api-functions';

export default function getApiFunctions({Axios,baseUrl}){
    return {
        user:userApiFunctions({Axios,baseUrl}),
        orders:orderApiFunctions({Axios,baseUrl})
    }
}
```
user-api-functions.js
``` javascript
export default function userApiFunctions({Axios,baseUrl}){
    return {
        async getUserInfo(parameter,appState){
            let url = `${baseUrl}/GetUserInfo`;
            let response = await Axios.get(url);
            let result = response.data.UserInfo;
            return {response,result}
        },
        ....
    }
}
```
order-api-functions.js
``` javascript
export default function orderApiFunctions({Axios,baseUrl}){
    return {
        async getMyOrders(parameter,appState){
            let url = `${baseUrl}/GetOrders`;
            let body = {
                userId:appState.userInfo.id,
                orderType:parameter
            }
            let response = await Axios.post(url,body);
            let result = response.data.data;
            return {response,result}
        },
        ....
    }
}
```
call nested api functions
``` javascript
let res = await apis.request({
    api:'orders.getMyOrders',
    parameter:0,
    description:'get user info',
    def:[],
    onSuccess:(orders)=>this.setState({orders})
})
```

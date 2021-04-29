let apps=angular.module('app',['ngRoute']);

apps.config(['$routeProvider',function($routeProvider) {
    $routeProvider
    
    .when('/product', {
  
      templateUrl:'./product.html',
      controller:'myctrl'
    
    })
    .when('/artical', {
  
      templateUrl:'./artical.html',
      controller:'myctrl'
   
    });
    }]);


   



apps.service('getData',function($http){

  this.getDatas=function(){
    
    return  $http.get('https://fakestoreapi.com/products')
    
  }

  
})





apps.directive('get',function(getData){

  return{

    restrict:'EA',
    template:   `
                <h2 style='text-align:center' ng-transclude></h2>
                <center><input class="searchProduct" type="text" placeholder="search here" ng-model="searchProduct"></center>
                <div ng-class={'loader':loading}>
                 <div class="product">
                 <div ng-repeat='el in data.data | filter:searchProduct'>
                 <img  src={{el.image}}>
                 <h4>{{el.title.length > 20 ? el.title.slice(0,30)+"..." : el.title }}</h4>
                 <h4>Price : {{el.price | currency}}<h4>
                 <button ng-click="addToCart(el.id)">Add to cart </button>
                 <div>
                 </div>`,
    transclude:true,
  
    controller:function($scope){

      $scope.data=[];
      $scope.cart=[];
      $scope.loading=false;
      getData.getDatas()
      .then(el=>{
        $scope.loading=true;
        $scope.data=el
        $scope.loading=false;
      }).
      catch(err=>console.log(err))
      
       $scope.addToCart=(id)=>{
        
        const l=$scope.cart.findIndex(el=>el.id===id);

        
         if(l===-1){

          const index=$scope.data.data.findIndex(el=>el.id===id)
          // console.log("index",index)
          $scope.cart.push($scope.data.data[index]);
          console.log($scope.cart)
          alert("Totally "+$scope.cart.length+" items in your cart")

         }
         

       }
      
    }

  }
})

apps.controller('myctrl',['$scope','$http',function($scope,$http){

    $scope.articalload=false;

    $scope.artical={
        title:'',
        intro:'',
        content:'',
        author_id:''
    }

    $scope.cool="Mass"

    $scope.articalData=[];
    $scope.postArtical=function(){

        if($scope.artical.title!=''&& $scope.artical.intro!=''&&$scope.artical.content!=''&&$scope.author_id!=''){

        $http.post(' http://simple-api.herokuapp.com/api/v1/articles',$scope.artical)
        .then(el=>console.log(el))
        .catch(el=>console.log(el))
         $scope.articalData=[];
         $scope.artical={};
        $scope.getArticals();

        }
        
    }

  // 
  

  $scope.getArticals=function(){

    $http.get('http://simple-api.herokuapp.com/api/v1/articles')
    .then(el=>{

        $scope.articalload=true;
        $scope.articalData=el.data.filter(el=>el.title!=null);
        $scope.articalload=false;

    })
    .catch(err=>alert(err))
     
  }

  

  

}]);




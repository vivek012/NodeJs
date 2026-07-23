

// function totalPairOfSum(x){
//     total = 0;
//     let arr = [1,2,3,4]
//     for(i=0; i<arr.length; i++){
//         for(j=i+1; j<arr.length; j++){
//             if(arr[i]+ arr[j] === x){
//                 total+=1
    
//             }
//         }
//     }
//    return (total)

// }

// console.log(totalPairOfSum(4))


let x = 4
let arr = [1,2,3,4,5,6]
let total = 0;

arr.forEach((value, i)=>{
    arr.forEach((nextValue, j)=>{
        if(j>i && value + nextValue === x ){
            total++;

        }
    })

})
console.log(total)
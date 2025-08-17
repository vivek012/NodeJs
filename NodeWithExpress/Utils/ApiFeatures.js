// class ApiFeatures {
//     constructor(query, queryStr) {
//         this.query = query;
//         this.queryStr = queryStr;

//     }

//     filter() {
//         let queryString = JSON.stringify(this.queryStr);
//         queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
//         const queryObj = JSON.parse(queryString);

//         this.query = this.query.find(queryObj);

//         return this;
//     }



//     sort() {
//         if (this.queryStr.sort) {
//             const sortBy = this.queryStr.sort.split(',').join(' ')
//             this.query = this.query.sort(sortBy)
//         } else {
//             this.query = this.query.sort('-createdAt');




//         }
        
//         return this;
//     }
    
//     limitFields() {
        
//         if (this.queryStr.fields) {
//             const fields = this.queryStr.fields.split(',').join(' ')
//             this.query = this.query.select(fields)
            
//         } else {
//             this.query = this.query.select('-__v')
//         }
//         return this;
//     }

//     paginate() {
//         const page = this.queryStr.page * 1 || 1;
//         const limit = this.queryStr.limit || 10;
//         const skip = (page - 1) * limit
//         this.query = this.query.skip(skip).limit(limit)

//         // if(this.queryStr.page){
//         //     const movieCount =  Movie.countDocuments()
//         //     if(skip >= movieCount){
//         //         throw new Error("this page is not found")
//         //     }
//         // }

//         return this;
//     }

// }
// module.exports = ApiFeatures;



class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;

    }
    
    filter(){
        console.log('FILTER LOGIC *****************************');

        let queryStr ={ ...this.queryStr };
        delete queryStr.sort;
        delete queryStr.fields;
        delete queryStr.limit;
        delete queryStr.page;

        let queryString = JSON.stringify( queryStr );
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryString);

        console.log(queryObj);

        this.query = this.query.find(queryObj);

        return this; 

    }

    

    sort(){
        if (this.queryStr.sort) {
            console.log('SORTING LOGIC *****************************');

            if (this.queryStr.sort) {
               const sortBy = this.queryStr.sort.split(',').join(' ')
               console.log(sortBy);
               this.query = this.query.sort(sortBy) 
           }else{
               this.query = this.query.sort('-createdAt');
   
           }
            
        }

        return this;
    }

    limitFields(){

        if (this.queryStr.fields) {

            console.log('LIMITFIELDS LOGIC *****************************');

            if (this.queryStr.fields){
                const fields = this.queryStr.fields.split(',').join(' ')
                this.query = this.query.select(fields)
               
            }else{
                this.query = this.query.select('-__v')
            }
            
        }
        return this;
    }

    paginate(){
        
      
            console.log('PAGINATE LOGIC *****************************');

            const page = this.queryStr.page*1 || 1;
            const limit = this.queryStr.limit || 10;
            const skip = (page-1)* limit
            this.query= this.query.skip(skip).limit(limit)
    
                // if(this.queryStr.page){
                //     const movieCount =  Movie.countDocuments()
                //     if(skip >= movieCount){
                //         throw new Error("this page is not found")
                //     }
                // }
        

            return this;
    }

}
module.exports = ApiFeatures;
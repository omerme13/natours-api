class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = {...this.queryString};
        const excluded = ['page', 'sort', 'limit', 'fields'];
    
        for (let exItem of excluded) {
            delete queryObj[exItem];
        }
    
        let queryStr = JSON.stringify(queryObj);
    
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryStr));
    
        return this;
    }
    
    sortBy() {
        this.query = this.queryString.sort
            ? this.query.sort(this.queryString.sort.split(',').join(' '))
            : this.query.sort('-createdAt');

        return this;    
    }
    
    limitFields() {
        this.query = this.queryString.fields
            ? this.query.select(this.queryString.fields.split(',').join(' '))
            : this.query.select('-__v');

        return this;        
    }
    
    paginate() {
        const page = +this.queryString.page || 1;
        const limit = +this.queryString.limit || 100;
    
        this.query.skip((page - 1) * limit).limit(limit);
        
        return this;
    }
}

module.exports = APIFeatures;
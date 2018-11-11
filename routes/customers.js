const errors = require('restify-errors');
const Customer = require('../models/Customer');

module.exports = server => {
    // Getting all customer in db
    server.get('/customers', async (req, res, next) => {
        
        try {
            const customers = await Customer.find({});
            res.send(customers);
        }
        catch (err) {
            return next(new errors.InvalidContentError(err));
        }
    })
        //Get one customer
       server.get('/customers/:id', async (req, res, next ) => {
           const id = req.params.id;

           try {
               const customer= await Customer.findById(id);
               res.send(customer);
           }
           catch(err) {
               return next(new errors.ResourceNotFoundError(
                   `There is no customer with the id ${req.params.id}`
               ));
           }
       })
          
       //Adding a customer
    server.post('/customers', async(req, res, next) =>{
        if(!req.is('application/json')) {
            return next(new errors.InvalidContentError("Expects Application/json"))
        }

        const { name, email, balance } = req.body;
        const customer = new Customer({
            name,
            email,
            balance
        })
        try {
            const Customer = await customer.save();
            res.send(201);
            next();
        } catch(err) {
             return next(new errors.InvalidContentError(err.message));
        }
    })

    //Updating customers
      server.put('/customers/:id', async (req, res, next) => {
          if(!req.is('application/json')) {
              return res.send(new errors.InvalidContentError('Expect application/json'))
          }
          const _id = req.params.id;
          try {
              const customer = await Customer.findOneAndUpdate({_id}, req.body)
              res.send(200);
              next();
           } catch(err) {
                return next(new errors.ResourceNotFoundError(
                    `There is no customer with the id ${id}`));
            }
      })

      //Delete a customer
       server.del('/customers/:id', async (req, res, next) => {
           const id = req.params._id
           try {
             const customer = await Customer.findOneAndDelete(id)
             res.send(204);
             next();
           } catch(err) {
               return next(new errors.ResourceNotFoundError(`There is no customer with the id ${id}`));
           }
       })

    
}
      


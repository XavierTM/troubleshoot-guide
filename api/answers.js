const { Router } = require("express");
const status_500 = require('./status_500');
const Joi = require('@xavisoft/joi');
const Answer = require("./db/Answer");


const answers = Router();


answers.post('/', async (req, res) => {
   try {

      // validation
      const schema = {
         caption: Joi.string().required(),
         question: Joi.number().integer(),
      }

      const error = Joi.getError(req.body, schema);
      if (error)
         return res.status(400).send(error);

      // save to db
      const { id } = await Answer.create(req.body);

      res.send({ id });

   } catch (err) {
      status_500(err, res);
   }
})

answers.get('/', async (req, res) => {
   try {
      const answers = await Answer.findAll();
      res.send(answers);
   } catch (err) {
      status_500(err, res);
   }
})

answers.delete('/:id', async (req, res) => {
   try {
      await Answer.destroy({ where: { id: req.params.id }});
      res.send();
   } catch (err) {
      status_500(err, res);
   }
})

answers.patch('/:id', async (req, res) => {
   try {

      // validation
      const schema = {
         body: Joi.object({
            caption: Joi.string(),
            sub_question: Joi.string(),
            solution: Joi.string(),
         }).min(1)
      }

      const error = Joi.getError({ body: req.body }, schema);
      if (error)
         return res.status(400).send(error);

      // save changes to db
      await Answer.update(req.body, { where: { id: req.params.id }});

      res.send();

   } catch (err) {
      status_500(err, res);
   }
})


module.exports = answers;
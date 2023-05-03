const { waitForServer, createRequester, createInstitution, createClerk, createAuthToken, createResourceType, createResource } = require("./utils");
const chai = require('chai');
const casual = require("casual");
const { assert, expect } = chai;
const chaiSpies = require('chai-spies');
const Answer = require("../db/Answer");

chai.use(chaiSpies);

const requester = createRequester();

const HOUR = 3600 * 1000;
const HALF_HOUR = HOUR / 2;
const MINUTE = 60 * 1000;

suite('Functional tests', function() {

   this.beforeAll(async () => {
      await waitForServer();
   });


   test('Create answer', async () => {

      const payload = {
         caption: casual.sentence,
      }

      const res = await requester
         .post('/api/answers')
         .send(payload);

      assert.equal(res.status, 200);

      // check db
      const answer = await Answer.findOne({ order: [[ 'id', 'DESC' ]]});
      assert.isObject(answer);
      assert.equal(answer.caption, payload.caption);


   });

   test("Delete answer from system", async () => {

      let answer = await Answer.create({
         caption: casual.sentence,
      })

      const res = await requester
         .delete(`/api/answers/${answer.id}`)
         .send();

      assert.equal(res.status, 200);

      // check db
      answer = await Answer.findByPk(answer.id);
      assert.isNull(answer);
   })

   test("Update System", async () => {

      let answer = await Answer.create({
         caption: casual.sentence,
      })

      const payload = {
         caption: casual.sentence,
         sub_question: casual.sentence,
      }

      const res = await requester
         .patch(`/api/answers/${answer.id}`)
         .send(payload);

      assert.equal(res.status, 200);

      // check db
      answer = await Answer.findByPk(answer.id);
      
      assert.equal(answer.caption, payload.caption);
      assert.equal(answer.sub_question, payload.sub_question);
      
   })
});
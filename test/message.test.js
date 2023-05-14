const chai = require("chai");
const chaiHttp = require("chai-http");
const { firestore } = require("../index");
const server = require("./app.test");

chai.use(chaiHttp);
const { expect } = chai;

describe("Messages API", () => {
    let conversationId;

    beforeEach(async () => {
        // Clean up the messages collection before each test
        const snapshot = await firestore.collection("messages").get();
        const batch = firestore.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();


        const conversationRef = await firestore.collection("conversations").add({
            users: ["user1", "user2"],
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        conversationId = conversationRef.id;
    });

    describe("POST /api/messages", () => {
        it("should create a new message", (done) => {
            chai
                .request(server)
                .post("/api/messages")
                .send({
                    conversationId: conversationId,
                    sender: "user1",
                    text: "Hi Ziad I'm Sohaib",
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property("id");
                    expect(res.body.conversationId).to.equal(conversationId);
                    expect(res.body.sender).to.equal("user1");
                    expect(res.body.text).to.equal("Hi Ziad I'm Sohaib");
                    done();
                });
        });
    });

    describe("GET /api/messages/:conversationId", () => {
        it("should return messages from a specific conversation", async () => {

            await firestore.collection("messages").add({
                conversationId: conversationId,
                sender: "user1",
                text: "Hi Ziad I'm Sohaib",
                createdAt: new Date(),
            });

            const res = await chai
                .request(server)
                .get(`/api/messages/${conversationId}`);
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body[0]).to.have.property("id");
            expect(res.body[0].conversationId).to.equal(conversationId);
            expect(res.body[0].sender).to.equal("user1");
            expect(res.body[0].text).to.equal("Hi Ziad I'm Sohaib");
        });
    });
});

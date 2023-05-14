const chai = require("chai");
const chaiHttp = require("chai-http");
const { firestore } = require("../index");
const server = require("./app.test");

chai.use(chaiHttp);
const { expect } = chai;

describe("Conversations API", () => {
    beforeEach(async () => {
        // Clean up the conversations collection before each test
        const snapshot = await firestore.collection("conversations").get();
        const batch = firestore.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    });

    describe("POST /api/conversations", () => {
        it("should create a new conversation", (done) => {
            chai
                .request(server)
                .post("/api/conversations")
                .send({
                    senderId: "user1",
                    receiverId: "user2",
                })
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property("id");
                    expect(res.body.users).to.deep.equal(["user1", "user2"]);
                    done();
                });
        });
    });

    describe("GET /api/conversations/:userId", () => {
        it("should return conversations of a user", async () => {

            await firestore.collection("conversations").add({
                users: ["user1", "user2"],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await chai.request(server).get("/api/conversations/user1");
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("array");
            expect(res.body[0]).to.have.property("id");
            expect(res.body[0].users).to.deep.equal(["user1", "user2"]);
        });
    });

    describe("GET /api/conversations/find/:firstUserId/:secondUserId", () => {
        it("should find a conversation between two users", async () => {

            await firestore.collection("conversations").add({
                users: ["user1", "user2"],
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const res = await chai
                .request(server)
                .get("/api/conversations/find/user1/user2");
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("id");
            expect(res.body.users).to.deep.equal(["user1", "user2"]);
        });

        it("should return 404 if no conversation found", async () => {
            const res = await chai
                .request(server)
                .get("/api/conversations/find/user1/user3");
            expect(res).to.have.status(404);
        });
    });
});

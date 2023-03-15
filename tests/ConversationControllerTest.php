<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ConversationControllerTest extends WebTestCase
{
    public function testCreateConversation()
    {
        $client = static::createClient();

        $client->request('POST', '/conversations/', [], [], [], json_encode([
            'receiverId' => 2,
            'message' => 'Hello World',
        ]));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());
        $this->assertJsonStringEqualsJsonString('{"data":{"id":1,"sendUserId":1,"receiverUserId":2,"message":"Hello World","createdAt":"2023-03-16T00:00:00+00:00"},"HTTP":201}', $client->getResponse()->getContent());
    }

    public function testGetConversations()
    {
        $client = static::createClient();
        $client->request('GET', '/conversations/');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertIsArray(json_decode($client->getResponse()->getContent()));
    }

    public function testGetLastMessage()
    {
        $client = static::createClient();
        $client->request('GET', '/conversations/last-message');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertIsString($client->getResponse()->getContent());
    }

    public function testGetUserMessages()
    {
        $client = static::createClient();
        $client->request('GET', '/conversations/messages/1/2');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
        $this->assertIsArray(json_decode($client->getResponse()->getContent()));
    }
}

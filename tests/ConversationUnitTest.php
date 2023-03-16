<?php
namespace App\Tests;

use App\Entity\Conversation;
use PHPUnit\Framework\TestCase;

class ConversationUnitTest extends TestCase
{
private Conversation $conversation;

protected function setUp(): void
{
$this->conversation = new Conversation();
}

public function testGetId()
{
$this->assertNull($this->conversation->getId());
}

public function testGetSendUserId()
{
$this->assertNull($this->conversation->getSendUserId());
}

public function testSetSendUserId()
{
$userId = 123;
$this->assertInstanceOf(Conversation::class, $this->conversation->setSendUserId($userId));
$this->assertEquals($userId, $this->conversation->getSendUserId());
}

public function testGetReceiverUserId()
{
$this->assertNull($this->conversation->getReceiverUserId());
}

public function testSetReceiverUserId()
{
$userId = 456;
$this->assertInstanceOf(Conversation::class, $this->conversation->setReceiverUserId($userId));
$this->assertEquals($userId, $this->conversation->getReceiverUserId());
}

public function testGetMessage()
{
$this->assertNull($this->conversation->getMessage());
}

public function testSetMessage()
{
$message = "Hello, World";
$this->assertInstanceOf(Conversation::class, $this->conversation->setMessage($message));
$this->assertEquals($message, $this->conversation->getMessage());
}

public function testGetCreatedAt()
{
$this->assertInstanceOf(\DateTimeImmutable::class, $this->conversation->getCreatedAt());
}

public function testSetCreatedAt()
{
$now = new \DateTimeImmutable();
$this->assertInstanceOf(Conversation::class, $this->conversation->setCreatedAt($now));
$this->assertEquals($now, $this->conversation->getCreatedAt());
}
}

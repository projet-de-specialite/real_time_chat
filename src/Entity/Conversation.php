<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ConversationRepository;
use Doctrine\ORM\Mapping as ORM;
use PhpParser\Node\Scalar\String_;
use Symfony\Component\Validator\Constraints\Json;

#[ORM\Entity(repositoryClass: ConversationRepository::class)]
#[ApiResource]
class Conversation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $sendUserId = null;

    #[ORM\Column]
    private ?int $receiverUserId = null;

    #[ORM\Column(length: 500)]

    private ?string $message = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt= new \DateTimeImmutable("now");
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSendUserId(): ?int
    {
        return $this->sendUserId;
    }

    public function setSendUserId(int $sendUserId): self
    {
        $this->sendUserId = $sendUserId;

        return $this;
    }

    public function getReceiverUserId(): ?int
    {
        return $this->receiverUserId;
    }

    public function setReceiverUserId(int $receiverUserId): self
    {
        $this->receiverUserId = $receiverUserId;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}

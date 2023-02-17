<?php

namespace App\Entity;

use App\Repository\ParticipantRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
#[ApiResource()]
#[ORM\Entity(repositoryClass: ParticipantRepository::class)]
class Participant
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'participants')]
    private ?Conversation $convertation = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getConvertation(): ?Conversation
    {
        return $this->convertation;
    }

    public function setConvertation(?Conversation $convertation): self
    {
        $this->convertation = $convertation;

        return $this;
    }
}

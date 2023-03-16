<?php

namespace App\Controller;

use ApiPlatform\Metadata\ApiResource;
use App\Entity\Conversation;
use App\Repository\ConversationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
#[Route('/conversations', name: 'conversations.')]
class ConversationController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ConversationRepository $conversationRepository;

    public function __construct(
        EntityManagerInterface $entityManager,
        ConversationRepository $conversationRepository
    )
    {
        $this->entityManager = $entityManager;
        $this->conversationRepository = $conversationRepository;
    }


    #[Route('/', name: 'newConversations', methods: ['POST'])]
    public function createConversation(Request $request): Response
    {
        $currentUserId = json_decode($this->getCurrentUser()->getContent(), true)['data']['id'];
        $data = json_decode($request->getContent());
        $conversation = new Conversation();
        $conversation->setSendUserId($currentUserId);
        $conversation->setReceiverUserId($data->receiverId);
        $conversation->setMessage($data->message);
        $this->entityManager->persist($conversation);
        $this->entityManager->flush();
        $response = new Response();
        $response->setContent(json_encode([
            'data' => $conversation,
            'HTTP' => Response::HTTP_CREATED
        ]));
        $response->headers->set('Content-Type', 'application/json');
        return $response;
    }

    public function getCurrentUser(): Response
    {
        $httpClient = HttpClient::create();
        $userResult = $httpClient->request('GET', 'https://jsonplaceholder.typicode.com/users/1');

        $content = $userResult->getContent();

        $this->userApiResult = json_decode($content);
        $response = new Response();
        $response->setContent(json_encode([
            'data' => $this->userApiResult,
            'HTTP' => Response::HTTP_OK
        ]));
        $response->headers->set('Content-Type', 'application/json');
        return $response;

    }

    #[Route('/', name: 'getConversations', methods: ['GET'])]
    public function getConversation(): Response
    {
        $currentUserId = json_decode($this->getCurrentUser()->getContent(), true)['data']['id'];
        $result = $this->conversationRepository->find($currentUserId);
        return $this->json($result);
    }

    #[Route('/last-message', name: 'last_message', methods: ['GET'])]
    public function getLastMessage(): Response
    {
        $lastMessage = $this->conversationRepository->findOneBy([], ['createdAt' => 'DESC']);

        if (!$lastMessage) {
            throw $this->createNotFoundException('No messages found in the database.');
        }
        return $this->json($lastMessage->getMessage());
    }

    #[Route('/messages/{sendUserId}/{receiverUserId}', name: 'messages', methods: ['GET'])]
    public function getUserMessages(int $sendUserId, int $receiverUserId): Response
    {
        $messages = $this->conversationRepository->findBy([
            'sendUserId' => $sendUserId,
            'receiverUserId' => $receiverUserId,
        ], ['createdAt' => 'ASC']);

        return $this->json($messages);
    }

    #[Route('/publish', name: 'publish')]
    public function publish(HubInterface $hub): Response
    {
        $update = new Update(
            'https://example.com/books/1',
            json_encode(['status' => 'message reçu'])
        );

        $hub->publish($update);

        return new Response('published!');
    }
}

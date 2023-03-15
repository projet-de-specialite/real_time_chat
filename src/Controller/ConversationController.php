<?php

namespace App\Controller;

use App\Entity\Conversation;
use App\Repository\ConversationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/conversations', name: 'conversations.')]
class ConversationController extends AbstractController
{
    private EntityManagerInterface $entityManager;


    public function __construct(
        EntityManagerInterface $entityManager,
    )
    {
        $this->entityManager = $entityManager;

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
        $conversationRepository = $this->entityManager->getRepository(ConversationRepository::class);
        $result = $conversationRepository->find($currentUserId);
        return $this->json($result);
    }


}

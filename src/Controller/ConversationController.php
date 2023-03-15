<?php

namespace App\Controller;

use App\Entity\Conversation;
use App\Entity\Participant;
use App\Repository\ConversationRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use mysql_xdevapi\Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/conversations', name: 'conversations.')]
class ConversationController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private ConversationRepository $conversationRepository;
    private UserRepository $userRepository;
    private $userApiResult;

    public function __construct(
        EntityManagerInterface $entityManager,
        ConversationRepository $conversationRepository,
        UserRepository         $userRepository
    )
    {
        $this->entityManager = $entityManager;
        $this->conversationRepository = $conversationRepository;
        $this->userRepository = $userRepository;
    }


    #[Route('/', name: 'newConversations', methods: ['POST'])]
    public function index(Request $request): JsonResponse
    {

        $otherUser = $request->get('otherUser', 0);
       // $otherUser = $this->getUserById($otherUser);
        $otherUser = $this->userRepository->find($otherUser);

        if (is_null($otherUser)) {
            throw new \Exception("No user Found");
        }

        // cannot create a conversation with myself
        if ($otherUser->getId() === $this->getUser()->getId()) {
            throw new \Exception("Error you can create a conversation with yourself");
        }

        // Check if conversation already exists
        $conversation = $this->conversationRepository->findConversationByParticipants(
            $otherUser->getId(),
            $this->getUser()->getId()
        );

        if (count($conversation)) {
            throw new \Exception("The conversation already exists");
        }

        $conversation = new Conversation();

        $participant = new Participant();
        $participant->setUser($this->getUser());
        $participant->setConversation($conversation);

        $otherParticipant = new Participant();
        $otherParticipant->setUser($otherUser);
        $otherParticipant->setConversation($conversation);

        $this->entityManager->getConnection()->beginTransaction();

        try {
            $this->entityManager->persist($conversation);
            $this->entityManager->persist($participant);
            $this->entityManager->persist($otherParticipant);

            $this->entityManager->flush();
            $this->entityManager->commit();
        } catch (\Exception $e) {
            $this->entityManager->rollback();
            throw $e;
        }

        return $this->json([
            'id' => $conversation->getId()
        ], Response::HTTP_CREATED);
    }

    #[Route('/', name: 'getConversations', methods: ['GET'])]
    public function getConvs(): JsonResponse
    {
        $conversations = $this->conversationRepository->findConversationsByUser($this->getUser()->getId());

        return $this->json($conversations);
    }


    public function getUserById(int $id)
    {
        try {
            $httpClient = HttpClient::create();
            $userResult = $httpClient->request('GET', 'https://api.example.com/data' . $id);

            $content = $userResult->getContent();

            $this->userApiResult = json_decode($content);
            $response = new Response();
            $response->setContent(json_encode([
                'data' => $this->userApiResult,
                'HTTP' => Response::HTTP_OK
            ]));
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception("Erreur: " . $exception->getMessage());
        }
    }

    public function getCurrentUser()
    {
        try {
            $httpClient = HttpClient::create();
            $userResult = $httpClient->request('GET', 'https://api.example.com/data');

            $content = $userResult->getContent();

            $this->userApiResult = json_decode($content);
            $response = new Response();
            $response->setContent(json_encode([
                'data' => $this->userApiResult,
                'HTTP' => Response::HTTP_OK
            ]));
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        } catch (\Exception $exception) {
            throw new \Exception("Erreur: " . $exception->getMessage());
        }
    }

}

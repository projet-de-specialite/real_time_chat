<?php

require 'vendor/autoload.php';

use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Hmac\Sha256;
use Lcobucci\JWT\Signer\Key\InMemory;

// Generate a random byte string and encode it in base64 format
$randomBytes = random_bytes(32);
$base64SecretKey = base64_encode($randomBytes);

// Replace $base64SecretKey with your actual base64-encoded secret key
$configuration = Configuration::forSymmetricSigner(
    new Sha256(),
    InMemory::plainText($base64SecretKey)
);

$token = $configuration->builder()
    ->withClaim('mercure', ['publish' => ['*']])
    ->getToken($configuration->signer(), $configuration->signingKey());

echo "Generated JWT Key: " . $token->toString() . PHP_EOL;
echo "Base64-encoded Secret Key: " . $base64SecretKey . PHP_EOL;

FROM php:8.1-apache

# Set the working directory to /var/www/html
WORKDIR /var/www/html

# Copy the Symfony project files to the container
COPY . .

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    libicu-dev \
    libpq-dev \
    zlib1g-dev \
    libzip-dev \
    unzip \
    libzmq3-dev && \
    docker-php-ext-configure intl && \
    docker-php-ext-install \
    intl \
    pdo \
    pdo_pgsql \
    zip \
    sockets && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    composer install --no-scripts --no-autoloader --prefer-dist && \
    rm -rf /var/lib/apt/lists/*

# Set the permissions of the var/ directory
RUN chown -R www-data:www-data var/

# Set the environment variables
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
ENV APACHE_LOG_DIR /var/log/apache2

# Enable Apache modules
RUN a2enmod rewrite

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]

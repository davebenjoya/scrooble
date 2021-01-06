ActionMailer::Base.add_delivery_method :cloudmailin, Mail::SMTP,
  address: ENV['CLOUDMAILIN_HOST'],
  port: 587,
  domain: 'yourdomain.com',
  user_name: ENV['CLOUDMAILIN_USERNAME'],
  password: ENV['CLOUDMAILIN_PASSWORD'],
  authentication: 'plain',
  enable_starttls_auto: true

# config/environments/production.yml
config.action_mailer.delivery_method = :cloudmailin

# Default url for mail
 config.action_mailer.default_url_options = { host: 'cloudmailin.com' }

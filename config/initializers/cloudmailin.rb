ActionMailer::Base.add_delivery_method :cloudmailin, Mail::SMTP,
  address: ENV['CLOUDMAILIN_HOST'],
  port: 587,
  domain: 'scroob.com',
  user_name: ENV['CLOUDMAILIN_USERNAME'],
  password: ENV['CLOUDMAILIN_PASSWORD'],
  authentication: 'plain',
  enable_starttls_auto: true


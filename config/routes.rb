Rails.application.routes.draw do
  devise_for :users
  resources :games
  root to: 'games#index'
  # require "sidekiq/web"
  # authenticate :user, ->(user) { user.admin? } do
  #   mount Sidekiq::Web => '/sidekiq'
  # end
end

Rails.application.routes.draw do
  get 'user_games/index'
  get 'user_games/show'
  get 'user_games/create'
  get 'user_games/update'
  devise_for :users
  resources :games
  resources :players
  root to: 'games#index'
  # require "sidekiq/web"
  # authenticate :user, ->(user) { user.admin? } do
  #   mount Sidekiq::Web => '/sidekiq'
  # end
end

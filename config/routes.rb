Rails.application.routes.draw do
  # get 'user_games/index'
  # get 'user_games/show'
  # get 'user_games/create'
  # get 'user_games/update'
  devise_for :users, sign_out_via: [:get, :post]

  resources :games
  resources :players
  resources :moves
  resources :letters

  post '/letters', to: 'letters#create'
  post '/moves', to: 'moves#create'
  get '/submission', to: 'moves#submit_broadcast'


  root to: 'games#index'
  # require "sidekiq/web"
  # authenticate :user, ->(user) { user.admin? } do
  #   mount Sidekiq::Web => '/sidekiq'
  # end
end

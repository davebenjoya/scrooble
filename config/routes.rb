Rails.application.routes.draw do

  namespace :devise do
    get 'registrations/update'
  end
  get 'user/update'
  get 'words/create'
  devise_for :users, sign_out_via: [:get, :post]

  resources :games
  resources :players
  resources :moves
  resources :letters
  resources :words
  resources :users

  post '/letters', to: 'letters#create'
  post '/moves', to: 'moves#create'
  get '/submission', to: 'moves#submit_broadcast'
  get '/check_accept', to: 'moves#check_accept'
patch '/games/:id/edit', to: 'games#update'
patch '/users/:id', to: 'users#update'

  root to: 'games#index'
  # require "sidekiq/web"
  # authenticate :user, ->(user) { user.admin? } do
  #   mount Sidekiq::Web => '/sidekiq'
  # end
end

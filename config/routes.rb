Rails.application.routes.draw do
  resources :games
  root to: 'games#index'
end

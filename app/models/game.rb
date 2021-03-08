class Game < ApplicationRecord
  has_many :players, dependent: :destroy
  has_many :users, through: :players

  # after_update_commit { broadcast_replace_to 'tiles'}
end

class Player < ApplicationRecord
  belongs_to :user
  belongs_to :game
  has_many :moves, dependent: :destroy
  # after_update_commit { broadcast_replace_to 'player'}
end

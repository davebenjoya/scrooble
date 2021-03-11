class Player < ApplicationRecord
  belongs_to :user
  belongs_to :game
  # after_update_commit { broadcast_replace_to 'player'}
end

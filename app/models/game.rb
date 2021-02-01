class Game < ApplicationRecord
  # serialize :scores, Array

  has_many :players, dependent: :destroy
  has_many :users, through: :players

  # after_create_commit { broadcast_prepend_to "tiles"}

  # after_update_commit { broadcast_replace_to "tiles"}
end

class Game < ApplicationRecord
  has_many :players, dependent: :destroy
  has_many :users, through: :players
  has_many :moves, through: :players


after_create_commit :broadcast_later

  # after_update_commit { broadcast_replace_to 'tiles'}

    private
      def broadcast_later
        broadcast_prepend_later_to @games, :games
      end
end


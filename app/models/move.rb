class Move < ApplicationRecord
  belongs_to :player
  has_many :letters, dependent: :destroy
end

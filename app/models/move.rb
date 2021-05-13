class Move < ApplicationRecord
  belongs_to :player
  has_many :words, dependent: :destroy
  has_many :letters, dependent: :destroy
end

class LettersController < ApplicationController

  def create
    @letter = Letter.new(letter_params)
    @letter.move = Move.find(params['move_id'])
    @letter.save!
    render json: @letter
    # raise
  end
end

private


  def letter_params
    params.require(:letter).permit(:move_id, :character, :position)
  end


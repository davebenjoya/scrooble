class WordsController < ApplicationController
  def create
    @word = Word.new(word_params)
    @word.save!
  end

  private

  def word_params
    params.require(:word).permit(:move_id, :characters, :score)
  end
end

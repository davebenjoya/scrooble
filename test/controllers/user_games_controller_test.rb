require "test_helper"

class UserGamesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get user_games_index_url
    assert_response :success
  end

  test "should get show" do
    get user_games_show_url
    assert_response :success
  end

  test "should get create" do
    get user_games_create_url
    assert_response :success
  end

  test "should get update" do
    get user_games_update_url
    assert_response :success
  end
end

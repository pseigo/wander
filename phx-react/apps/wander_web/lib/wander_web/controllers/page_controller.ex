defmodule WanderWeb.PageController do
  use WanderWeb, :controller

  def home(conn, _params) do
    render(conn, :home)
  end
end

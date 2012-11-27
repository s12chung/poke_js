require "poke_js/view_helpers"

module PokeJs
  if defined?(Rails) && defined?(Rails::Engine)
    class Engine < ::Rails::Engine
      initializer "poke_js.view_helpers" do
        ActionView::Base.send :include, ViewHelpers
      end
    end
  end
end